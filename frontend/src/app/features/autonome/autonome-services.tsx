"use client";

import { useEffect, useState } from "react";
import { useAutonome } from "../../hooks/useAutonome";
import { Card } from "../../components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Loader2 } from "lucide-react";
import type { Service } from "../../hooks/useAutonome";

const AUTONOME_ADDRESS = process.env.NEXT_PUBLIC_AUTONOME_ADDRESS || "";
const OLAS_ADDRESS = process.env.NEXT_PUBLIC_OLAS_ADDRESS || "";

export function AutonomeServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { fetchServices, loading, isConnected } = useAutonome({
    autonomeAddress: AUTONOME_ADDRESS,
    olasAddress: OLAS_ADDRESS,
  });

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchServices();
        setServices(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch services:", err);
        setError("Failed to load services. Please try again later.");
      }
    };

    if (isConnected) {
      loadServices();
    }
  }, [isConnected, fetchServices]);

  if (!isConnected) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-600">
          Please connect your wallet to view services
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
          <span className="text-gray-600">Loading services...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">{error}</div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Available Services</h2>
        <p className="text-sm text-gray-600">
          Browse and register for Autonome services
        </p>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No services available at this time
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="max-w-[500px]">Description</TableHead>
                <TableHead className="w-32">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-mono">{service.id}</TableCell>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell className="max-w-[500px] truncate">
                    {service.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant={service.active ? "success" : "secondary"}>
                      {service.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}

export default AutonomeServices;
