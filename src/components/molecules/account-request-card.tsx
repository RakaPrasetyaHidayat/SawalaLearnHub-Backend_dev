"use client"

import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/molecules/cards/card"
import { Button } from "@/components/atoms/ui/button"

export type AccountRole = "student" | "employee" | "admin"

export interface AccountRequest {
    id: string
    name: string
    email: string
    requestedRole?: AccountRole
}

interface AccountRequestCardProps {
    request: AccountRequest
    onApprove: (requestId: string, role: AccountRole) => void
    onReject: (requestId: string) => void
}

export default function AccountRequestCard({ request, onApprove, onReject }: AccountRequestCardProps) {
    const [selectedRole, setSelectedRole] = useState<AccountRole>(request.requestedRole || "student")

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-base">{request.name}</CardTitle>
                <CardDescription>{request.email}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-2">
                    <label className="text-sm text-gray-600" htmlFor={`role-${request.id}`}>Assign role</label>
                    <select
                        id={`role-${request.id}`}
                        className="border rounded-md px-3 py-2 text-sm"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as AccountRole)}
                    >
                        <option value="student">Siswa</option>
                        <option value="employee">Karyawan</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => onApprove(request.id, selectedRole)}>Approve</Button>
                <Button className="bg-transparent text-red-600 hover:bg-red-50" onClick={() => onReject(request.id)}>Reject</Button>
            </CardFooter>
        </Card>
    )
}



