import type { balance } from "@prisma/client";
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type Decimal from "decimal.js";
import { Table } from "./table";
const columnHelper = createColumnHelper<balance>();

const columns = [
	columnHelper.accessor("description", {
		cell: (info) => info.getValue(),
		header: () => "Description",
	}),
	columnHelper.accessor("value", {
		cell: (info) => info.getValue<Decimal>().toFixed(2),
		header: () => "Balance",
	}),
];

export const BalancesTable: React.FC<{ balances: balance[] }> = (props) => {
	const table = useReactTable({
		data: props.balances,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return <Table table={table} />;
};
