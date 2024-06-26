import { CellContext, ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { IOrderHistory } from "@/types/order.types"
import { typeTextDef } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"

import HistoryItemAction from "./historyItemAction"

export const formatDate = (info: CellContext<IOrderHistory, unknown>) =>
  info.getValue()
    ? format(new Date(info.getValue() as string), "yyyy.MM.dd HH:mm")
    : "-"

const columns: ColumnDef<IOrderHistory>[] = [
  {
    accessorKey: "number",
    header: "Дугаар",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "status",
    header: "Cтатус",
    cell: (info) => <Badge>{info.getValue() as React.ReactNode}</Badge>,
  },
  {
    accessorKey: "totalAmount",
    header: "Дүн",
    cell: (info) => (info.getValue() || "").toLocaleString(),
  },
  {
    accessorKey: "type",
    header: "Төрөл",
    cell: (info) => typeTextDef[info.getValue() as keyof typeof typeTextDef],
  },
  {
    accessorKey: "createdAt",
    header: "Үүсгэсэн огноо",
    cell: formatDate,
  },
  {
    accessorKey: "modifiedAt",
    header: "Өөрчилсөн огноо",
    cell: formatDate,
  },
  {
    accessorKey: "paidDate",
    header: "Төлбөр төлсөн огноо",
    cell: formatDate,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }: CellContext<IOrderHistory, unknown>) => (
      <HistoryItemAction {...(row.original || {})} />
    ),
  },
]

export default columns
