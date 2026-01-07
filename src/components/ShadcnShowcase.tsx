import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export function ShadcnShowcase() {
    return (
        <div className="w-full space-y-12">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Shadcn UI Components Showcase</h2>
                <p className="text-muted-foreground">
                    A collection of components currently installed in the project, styled with Tailwind CSS.
                </p>
            </div>

            {/* Buttons */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Buttons</h3>
                <div className="flex flex-wrap gap-4">
                    <Button>Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon" variant="outline">h</Button>
                </div>
            </section>

            {/* Inputs & Forms */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Inputs & Selects</h3>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input type="email" id="email" placeholder="Email" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <label className="text-sm font-medium">Select Option</label>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="orange">Orange</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </section>

            {/* Cards */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Cards</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Card Title</CardTitle>
                            <CardDescription>Card Description goes here.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Card content. You can put anything here.</p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Action</Button>
                        </CardFooter>
                    </Card>
                </div>
            </section>

            {/* Tables */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Table</h3>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">INV001</TableCell>
                                <TableCell>Paid</TableCell>
                                <TableCell>Credit Card</TableCell>
                                <TableCell className="text-right">$250.00</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">INV002</TableCell>
                                <TableCell>Pending</TableCell>
                                <TableCell>PayPal</TableCell>
                                <TableCell className="text-right">$140.00</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </section>

            {/* Pagination */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Pagination</h3>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" isActive>
                                2
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </section>

        </div>
    );
}
