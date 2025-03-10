// @ts-ignore
import * as telemetry from "erxes-telemetry";
import * as jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import redis from "@erxes/api-utils/src/redis";
import { IModels, generateModels } from "../connectionResolver";
import { getSubdomain, userActionsMap } from "@erxes/api-utils/src/core";
import { USER_ROLES } from "@erxes/api-utils/src/constants";
import fetch from "node-fetch";
import { setUserHeader } from "@erxes/api-utils/src/headers";

export default async function userMiddleware(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) {
  const url = req.headers["erxes-core-website-url"];
  const erxesCoreToken = req.headers["erxes-core-token"];

  if (Array.isArray(erxesCoreToken)) {
    return res.status(400).json({ error: `Multiple erxes-core-tokens found` });
  }

  if (erxesCoreToken && url) {
    try {
      const response = await fetch("https://erxes.io/check-website", {
        method: "POST",
        headers: {
          "erxes-core-token": erxesCoreToken,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url
        })
      }).then(r => r.text());

      if (response === "ok") {
        req.user = {
          _id: "userId",
          customPermissions: [
            {
              action: "showIntegrations",
              allowed: true,
              requiredActions: []
            },
            {
              action: "showKnowledgeBase",
              allowed: true,
              requiredActions: []
            },
            {
              action: "showScripts",
              allowed: true,
              requiredActions: []
            }
          ]
        };
      }
    } catch (e) {
      return next();
    }

    return next();
  }

  const appToken = (req.headers["erxes-app-token"] || "").toString();
  const subdomain = getSubdomain(req);

  let models: IModels;
  try {
    models = await generateModels(subdomain);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }

  if (appToken) {
    try {
      const { app }: any = jwt.verify(
        appToken,
        process.env.JWT_TOKEN_SECRET || ""
      );

      if (app && app._id) {
        const appInDb = await models.Apps.findOne({ _id: app._id });

        if (appInDb) {
          const permissions = await models.Permissions.find({
            groupId: appInDb.userGroupId,
            allowed: true
          }).lean();

          const user = await models.Users.findOne({
            role: USER_ROLES.SYSTEM,
            groupIds: { $in: [app.userGroupId] },
            appId: app._id
          }).lean();

          if (user) {
            const key = `user_permissions_${user._id}`;
            const cachedPermissions = await redis.get(key);

            if (
              !cachedPermissions ||
              (cachedPermissions && cachedPermissions === "{}")
            ) {
              const userPermissions = await models.Permissions.find({
                userId: user._id
              });
              const groupPermissions = await models.Permissions.find({
                groupId: { $in: user.groupIds }
              });

              const actionMap = await userActionsMap(
                userPermissions,
                groupPermissions,
                user
              );

              await redis.set(key, JSON.stringify(actionMap));
            }

            req.user = {
              _id: user._id || "userId",
              ...user,
              role: USER_ROLES.SYSTEM,
              isOwner: appInDb.allowAllPermission || false,
              customPermissions: permissions.map(p => ({
                action: p.action,
                allowed: p.allowed,
                requiredActions: p.requiredActions
              }))
            };
          }
        }
      }

      setUserHeader(req.headers, req.user);

      return next();
    } catch (e) {
      console.error(e);

      return next();
    }
  }

  const clientToken = req.headers["x-app-token"];

  if (clientToken) {
    const token = String(clientToken);
    try {
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_TOKEN_SECRET || ""
      );

      const client = await models.Clients.findOne({
        clientId: decoded.clientId
      });

      if (!client) {
        return next();
      }

      if (
        client.whiteListedIps?.length > 0 &&
        !client.whiteListedIps.includes(req.ip)
      ) {
        return next();
      }

      const systemUser = await models.Users.findOne({
        role: USER_ROLES.SYSTEM,
        appId: client._id
      });

      if (!systemUser) {
        return next();
      }

      req.user = systemUser;
      setUserHeader(req.headers, req.user);

      return next();
    } catch (e) {
      console.error(e);

      return next();
    }
  }

  const token = req.cookies["auth-token"];

  if (!token) {
    return next();
  }

  try {
    // verify user token and retrieve stored user information
    const decoded: any = jwt.verify(token, process.env.JWT_TOKEN_SECRET || "");
    const user = decoded.user;

    const userDoc = await models.Users.findOne(
      { _id: user._id },
      "_id email details isOwner groupIds brandIds username code departmentIds"
    ).lean();

    if (!userDoc) {
      return next();
    }

    const validatedToken = await redis.get(`user_token_${user._id}_${token}`);

    // invalid token access.
    if (!validatedToken) {
      return next();
    }

    // save user in request
    req.user = userDoc;
    req.user.loginToken = token;
    req.user.sessionCode = req.headers.sessioncode || "";

    const currentDate = new Date();
    const machineId: string = telemetry.getMachineId();

    const lastLoginDate = new Date((await redis.get(machineId)) || "");

    if (lastLoginDate.getDay() !== currentDate.getDay()) {
      redis.set(machineId, currentDate.toJSON());

      telemetry.trackCli("last_login", { updatedAt: currentDate });
    }

    const hostname = await redis.get("hostname");

    if (!hostname) {
      redis.set("hostname", process.env.DOMAIN || "http://localhost:3000");
    }
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
    } else {
      console.error(e);
    }
  }

  setUserHeader(req.headers, req.user);

  return next();
}
