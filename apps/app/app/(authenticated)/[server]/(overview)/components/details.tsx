import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@repo/design-system/ui/table';

type DetailsProps = {
  cores: number;
  memory: number;
  storage: number;
  os: string;
  location: string;
  cost: number;
};

export const Details = ({
  cores,
  memory,
  storage,
  os,
  location,
  cost,
}: DetailsProps) => (
  <div className="overflow-hidden rounded-md border bg-background">
    <Table>
      <TableBody>
        <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
          <TableCell className="bg-muted/50 py-2 font-medium">Cores</TableCell>
          <TableCell className="py-2">{cores}</TableCell>
        </TableRow>
        <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
          <TableCell className="bg-muted/50 py-2 font-medium">Memory</TableCell>
          <TableCell className="py-2">{memory}</TableCell>
        </TableRow>
        <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
          <TableCell className="bg-muted/50 py-2 font-medium">
            Storage
          </TableCell>
          <TableCell className="py-2">{storage}</TableCell>
        </TableRow>
        <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
          <TableCell className="bg-muted/50 py-2 font-medium">
            Location
          </TableCell>
          <TableCell className="py-2">{location}</TableCell>
        </TableRow>
        <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
          <TableCell className="bg-muted/50 py-2 font-medium">OS</TableCell>
          <TableCell className="py-2">{os}</TableCell>
        </TableRow>
        <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
          <TableCell className="bg-muted/50 py-2 font-medium">Cost</TableCell>
          <TableCell className="py-2">{cost}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
);
