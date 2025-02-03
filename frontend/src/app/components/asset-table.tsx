import { Avatar } from "../components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";

interface Asset {
  name: string;
  symbol: string;
  price: number | string;
  holdings: number | string;
  value: number | string;
  change24h: string;
  allocation: number | string;
}

export function AssetTable({ assets }: { assets: Asset[] }) {
  if (!assets || assets.length === 0) {
    return <div>No asset data available.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Holdings</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>24h Change</TableHead>
          <TableHead>Allocation</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets.map((asset) => (
          <TableRow key={asset.symbol}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <Image
                    src={`/placeholder.svg?height=24&width=24`}
                    alt={asset.name}
                    width={24}
                    height={24}
                  />
                </Avatar>
                <div>
                  <div className="font-medium">{asset.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {asset.symbol}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>{asset.price}</TableCell>
            <TableCell>{asset.holdings}</TableCell>
            <TableCell>{asset.value}</TableCell>
            <TableCell
              className={
                asset.change24h.startsWith("+")
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {asset.change24h}
            </TableCell>
            <TableCell>{asset.allocation}</TableCell>
            <TableCell>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
