import * as compose from "lodash.flowright";

import { DragDropContext, Droppable } from "react-beautiful-dnd";
import {
  IItemMap,
  IOptions,
  IPipeline,
  IStageMap,
  StagesQueryResponse,
} from "../types";
import { PipelineConsumer, PipelineProvider } from "./PipelineContext";
import React, { Component } from "react";

import EmptyState from "@erxes/ui/src/components/EmptyState";
import Spinner from "@erxes/ui/src/components/Spinner";
import Stage from "./Stage";
import { gql } from "@apollo/client";
import { graphql } from "@apollo/client/react/hoc";
import { queries } from "../graphql";
import styled from "styled-components";
import { withProps } from "@erxes/ui/src/utils";
import { useLocation, useNavigate } from "react-router-dom";

const Container = styled.div`
  height: 100%;
  display: inline-flex;
`;

type Props = {
  pipeline: IPipeline;
  initialItemMap?: IItemMap;
  stageMap?: IStageMap;
  queryParams: any;
  navigate: any;
  location: any;
  options: IOptions;
};

class WithStages extends Component<WithStagesQueryProps> {
  componentWillReceiveProps(nextProps: Props) {
    const { stagesQuery, queryParams } = this.props;
    const { pipelineId } = queryParams;

    if (this.queryParamsChanged(queryParams, nextProps.queryParams)) {
      stagesQuery.refetch({ pipelineId });
    }
  }

  queryParamsChanged = (queryParams: any, nextQueryParams: any) => {
    if (nextQueryParams.itemId || (!queryParams.key && queryParams.itemId)) {
      return false;
    }

    if (queryParams !== nextQueryParams) {
      return true;
    }

    return false;
  };

  countStages(obj) {
    return Object.keys(obj).length;
  }

  render() {
    const {
      initialItemMap,
      pipeline,
      stageMap,
      options,
      queryParams,
      stagesQuery,
      navigate,
      location,
    } = this.props;

    const stagesCount = this.countStages(stageMap);

    if (stagesCount === 0) {
      return (
        <EmptyState
          image="/images/actions/8.svg"
          text="No stage in this pipeline"
          size="small"
          light={true}
        />
      );
    }

    return (
      <PipelineProvider
        pipeline={pipeline}
        initialItemMap={initialItemMap}
        queryParams={queryParams}
        options={options}
        queryParamsChanged={this.queryParamsChanged}
        navigate={navigate}
        location={location}
      >
        <PipelineConsumer>
          {({
            stageLoadMap,
            itemMap,
            onDragEnd,
            onDragStart,
            stageIds,
            scheduleStage,
            refetchStage,
            onLoadStage,
            onAddItem,
            onRemoveItem,
          }) => (
            <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
              <Droppable
                droppableId="pipeline"
                type="STAGE"
                direction="horizontal"
                ignoreContainerClipping={true}
              >
                {(provided) => (
                  <Container
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {stageIds.map((stageId, index) => {
                      const stage = stageMap && stageMap[stageId];

                      if (!stage) {
                        return null;
                      }

                      return (
                        <Stage
                          options={options}
                          key={stageId}
                          index={index}
                          length={stagesCount}
                          stage={stage}
                          items={itemMap[stageId]}
                          queryParams={queryParams}
                          loadingState={stageLoadMap[stageId]}
                          refetchStages={stagesQuery.refetch}
                          scheduleStage={scheduleStage}
                          refetchStage={refetchStage}
                          onLoad={onLoadStage}
                          onAddItem={onAddItem}
                          onRemoveItem={onRemoveItem}
                        />
                      );
                    })}
                    {provided.placeholder}
                  </Container>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </PipelineConsumer>
      </PipelineProvider>
    );
  }
}

type WithStagesQueryProps = {
  stagesQuery: StagesQueryResponse;
} & Props;

const WithStagesQuery = (props: WithStagesQueryProps) => {
  const { stagesQuery } = props;
  const navigate = useNavigate();
  const location = useLocation();

  if (stagesQuery.loading) {
    return <Spinner />;
  }

  const stages = stagesQuery.stages || [];

  const itemMap: IItemMap = {};
  const stageMap: IStageMap = {};

  for (const stage of stages) {
    itemMap[stage._id] = [];
    stageMap[stage._id] = stage;
  }

  return (
    <WithStages
      {...props}
      navigate={navigate}
      location={location}
      stageMap={stageMap}
      initialItemMap={itemMap}
    />
  );
};

type WithQueryProps = Props & { abortController };

const WithQuery = withProps<WithQueryProps>(
  compose(
    graphql<WithQueryProps, StagesQueryResponse>(gql(queries.stages), {
      name: "stagesQuery",
      options: ({
        pipeline,
        queryParams,
        options: { getExtraParams },
        abortController,
      }) => ({
        variables: {
          pipelineId: pipeline._id,
          search: queryParams.search,
          customerIds: queryParams.customerIds,
          companyIds: queryParams.companyIds,
          assignedUserIds: queryParams.assignedUserIds,
          labelIds: queryParams.labelIds,
          extraParams: getExtraParams(queryParams),
          closeDateType: queryParams.closeDateType,
          userIds: queryParams.userIds,
          assignedToMe: queryParams.assignedToMe,
          branchIds: queryParams.branchIds,
          departmentIds: queryParams.departmentIds,
          segment: queryParams.segment,
          segmentData: queryParams.segmentData,
        },
        context: {
          fetchOptions: { signal: abortController && abortController.signal },
        },
      }),
    })
  )(WithStagesQuery)
);

class WithData extends React.Component<Props> {
  private abortController;

  componentWillUnmount() {
    this.abortController.abort();
  }

  constructor(props) {
    super(props);

    this.abortController = new AbortController();
  }

  render() {
    const updatedProps = {
      ...this.props,
      abortController: this.abortController,
    };

    return <WithQuery {...updatedProps} />;
  }
}

export default withProps<Props>(WithData);
