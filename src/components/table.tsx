import type { Table as TTable } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";

type TableProps = {
	table: TTable<any>;
};
export const Table: React.FC<TableProps> = (props) => (
	<table className="table w-full">
		<thead>
			{props.table.getHeaderGroups().map((headerGroup) => (
				<tr key={headerGroup.id}>
					{headerGroup.headers.map((header) => (
						<th key={header.id}>
							{header.isPlaceholder
								? null
								: flexRender(
										header.column.columnDef.header,
										header.getContext()
								  )}
						</th>
					))}
				</tr>
			))}
		</thead>
		<tbody>
			{props.table.getRowModel().rows.map((row) => (
				<tr key={row.id}>
					{row.getVisibleCells().map((cell) => (
						<td key={cell.id}>
							{flexRender(cell.column.columnDef.cell, cell.getContext())}
						</td>
					))}
				</tr>
			))}
		</tbody>
	</table>
);
