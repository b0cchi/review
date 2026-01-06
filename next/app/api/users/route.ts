import { NextRequest, NextResponse } from "next/server";

type Member = {
    name: string;
    role: string;
    email: string;
    status: "Active" | "Onboarding" | "OOO";
};

const members: Member[] = [
    { name: "Ava Larson", role: "Product Manager", email: "ava.larson@example.com", status: "Active" },
    { name: "Diego Ramos", role: "Staff Engineer", email: "diego.ramos@example.com", status: "Active" },
    { name: "Mei Tan", role: "Design Lead", email: "mei.tan@example.com", status: "Onboarding" },
    { name: "Samir Khan", role: "Data Analyst", email: "samir.khan@example.com", status: "Active" },
    { name: "Claire Dupont", role: "Customer Success", email: "claire.dupont@example.com", status: "OOO" },
    { name: "Noah Fischer", role: "QA Engineer", email: "noah.fischer@example.com", status: "Onboarding" },
    { name: "Lena Schultz", role: "Data Engineer", email: "lena.schultz@example.com", status: "Active" },
    { name: "Marcus Lee", role: "Security Lead", email: "marcus.lee@example.com", status: "Active" },
    { name: "Priya Desai", role: "Marketing Manager", email: "priya.desai@example.com", status: "Onboarding" },
    { name: "Ethan Clark", role: "Support Engineer", email: "ethan.clark@example.com", status: "OOO" },
    { name: "Julia Romano", role: "Ops Manager", email: "julia.romano@example.com", status: "Active" },
    { name: "Aria Patel", role: "Mobile Engineer", email: "aria.patel@example.com", status: "Onboarding" },
    { name: "Leo Martins", role: "Solutions Architect", email: "leo.martins@example.com", status: "Active" },
    { name: "Sofia Nguyen", role: "Growth PM", email: "sofia.nguyen@example.com", status: "Active" },
    { name: "Harper Young", role: "Content Strategist", email: "harper.young@example.com", status: "OOO" },
    { name: "Omar Haddad", role: "Frontend Engineer", email: "omar.haddad@example.com", status: "Active" },
    { name: "Rina Sato", role: "Researcher", email: "rina.sato@example.com", status: "Onboarding" },
    { name: "Victor Chen", role: "Platform Engineer", email: "victor.chen@example.com", status: "Active" },
    { name: "Isla Brooks", role: "People Ops", email: "isla.brooks@example.com", status: "Active" },
    { name: "Hugo Silva", role: "Sales Lead", email: "hugo.silva@example.com", status: "OOO" },
    { name: "Nina Ivanova", role: "Data Scientist", email: "nina.ivanova@example.com", status: "Active" },
    { name: "Zane Cooper", role: "Backend Engineer", email: "zane.cooper@example.com", status: "Onboarding" },
    { name: "Ivy Johnson", role: "Finance Manager", email: "ivy.johnson@example.com", status: "Active" },
    { name: "Caleb Wright", role: "Support Specialist", email: "caleb.wright@example.com", status: "Active" },
];

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const pageSize = Math.max(Number(searchParams.get("pageSize")) || 8, 1);
    const q = (searchParams.get("q") || "").trim().toLowerCase();

    const filtered = q
        ? members.filter((member) =>
            `${member.name} ${member.email}`.toLowerCase().includes(q),
        )
        : members;

    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);

    return NextResponse.json({
        members: paged,
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.max(Math.ceil(filtered.length / pageSize), 1),
    });
}
