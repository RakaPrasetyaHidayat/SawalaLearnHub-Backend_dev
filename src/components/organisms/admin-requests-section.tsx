"use client"

import React, { useMemo, useState } from "react"

// Temporary inline AccountRequestCard placeholder to satisfy build until the real component exists
export type AccountRole = "student" | "employee" | "admin";
export type AccountRequest = { id: string; name: string; email: string; requestedRole?: string };
function AccountRequestCard({ request, onApprove, onReject }: { request: AccountRequest; onApprove: (id: string, role: AccountRole) => void; onReject: (id: string) => void }) {
    return (
        <div className="p-3 border rounded">
            <div className="flex justify-between">
                <div>
                    <div className="font-medium">{request.name}</div>
                    <div className="text-xs text-gray-500">{request.email}</div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => onApprove(request.id, (request.requestedRole || 'student') as AccountRole)} className="px-2 py-1 bg-green-600 text-white rounded">Approve</button>
                    <button onClick={() => onReject(request.id)} className="px-2 py-1 bg-red-600 text-white rounded">Reject</button>
                </div>
            </div>
        </div>
    )
}

export default function AdminRequestsSection() {
    const [requests] = useState<AccountRequest[]>([
        { id: "1", name: "Agni Alatas", email: "agni@example.com", requestedRole: "student" },
        { id: "2", name: "Budi Santoso", email: "budi@example.com" },
        { id: "3", name: "Citra Dewi", email: "citra@example.com", requestedRole: "employee" },
    ])

    const [approved, setApproved] = useState<{ id: string; role: AccountRole }[]>([])
    const [rejected, setRejected] = useState<string[]>([])

    const pending = useMemo(() =>
        requests.filter(r => !approved.find(a => a.id === r.id) && !rejected.includes(r.id))
    , [requests, approved, rejected])

    const handleApprove = (requestId: string, role: AccountRole) => {
        setApproved(prev => [...prev, { id: requestId, role }])
    }

    const handleReject = (requestId: string) => {
        setRejected(prev => [...prev, requestId])
    }

    return (
        <section className="w-full space-y-4">
            <div>
                <h2 className="text-lg font-semibold">Pending Account Requests</h2>
                <p className="text-sm text-gray-600">Approve or reject new account creations and assign roles.</p>
            </div>

            <div className="grid gap-3">
                {pending.length === 0 ? (
                    <p className="text-sm text-gray-500">No pending requests.</p>
                ) : (
                    pending.map(req => (
                        <AccountRequestCard key={req.id} request={req} onApprove={handleApprove} onReject={handleReject} />
                    ))
                )}
            </div>

            {(approved.length > 0 || rejected.length > 0) && (
                <div className="pt-2 border-t">
                    {approved.length > 0 && (
                        <div className="mb-3">
                            <h3 className="text-sm font-medium">Approved</h3>
                            <ul className="text-sm text-gray-700 list-disc ml-5">
                                {approved.map(a => {
                                    const u = requests.find(r => r.id === a.id)
                                    return <li key={a.id}>{u?.name} — role: <span className="font-medium">{a.role}</span></li>
                                })}
                            </ul>
                        </div>
                    )}
                    {rejected.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium">Rejected</h3>
                            <ul className="text-sm text-gray-700 list-disc ml-5">
                                {rejected.map(id => {
                                    const u = requests.find(r => r.id === id)
                                    return <li key={id}>{u?.name}</li>
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </section>
    )
}



