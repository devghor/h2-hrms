import { BaseDialog } from '@/components/dialog/base-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { breadcrumbItems } from '@/config/breadcrumbs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Option = { id: number; name: string };

interface Employee {
    id: number;
    user_id: number;
    ulid: string;
    employee_code: string | null;
    first_name: string;
    last_name: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    date_of_birth: string | null;
    gender: string | null;
    hire_date: string | null;
    employment_status: string;
    department_id: number | null;
    designation_id: number | null;
    manager_id: number | null;
    address: string | null;
    city: string | null;
    country: string | null;
    status: boolean;
    department: Option | null;
    designation: Option | null;
    manager: { id: number; full_name: string | null; first_name: string; last_name: string } | null;
    contacts: EmployeeContact[];
    documents: EmployeeDocument[];
    education: EmployeeEducation[];
    experience: EmployeeExperience[];
}

interface EmployeeContact {
    id: number;
    contact_name: string;
    relationship: string | null;
    phone: string | null;
}

interface EmployeeDocument {
    id: number;
    document_name: string;
    document_type: string | null;
    file_path: string | null;
}

interface EmployeeEducation {
    id: number;
    degree: string;
    institution: string | null;
    year_of_passing: number | null;
}

interface EmployeeExperience {
    id: number;
    company_name: string;
    designation: string | null;
    start_date: string | null;
    end_date: string | null;
    responsibilities: string | null;
}

interface Props {
    employee: Employee;
    departments: Option[];
    designations: Option[];
    managers: Option[];
}

export default function Show({ employee, departments, designations, managers }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        breadcrumbItems.dashboard,
        breadcrumbItems.employeeEmployees,
        { title: employee.full_name || `${employee.first_name} ${employee.last_name}`, href: '#' },
    ];

    // ── Contact state ──────────────────────────────────────────────────────────
    const [contactOpen, setContactOpen] = useState(false);
    const [contactEdit, setContactEdit] = useState(false);
    const [contactForm, setContactForm] = useState({ id: undefined as number | undefined, contact_name: '', relationship: '', phone: '' });
    const [contactErrors, setContactErrors] = useState<Record<string, string>>({});

    // ── Document state ─────────────────────────────────────────────────────────
    const [docOpen, setDocOpen] = useState(false);
    const [docEdit, setDocEdit] = useState(false);
    const [docForm, setDocForm] = useState({ id: undefined as number | undefined, document_name: '', document_type: '', file_path: '' });
    const [docErrors, setDocErrors] = useState<Record<string, string>>({});

    // ── Education state ────────────────────────────────────────────────────────
    const [eduOpen, setEduOpen] = useState(false);
    const [eduEdit, setEduEdit] = useState(false);
    const [eduForm, setEduForm] = useState({ id: undefined as number | undefined, degree: '', institution: '', year_of_passing: '' });
    const [eduErrors, setEduErrors] = useState<Record<string, string>>({});

    // ── Experience state ───────────────────────────────────────────────────────
    const [expOpen, setExpOpen] = useState(false);
    const [expEdit, setExpEdit] = useState(false);
    const [expForm, setExpForm] = useState({ id: undefined as number | undefined, company_name: '', designation: '', start_date: '', end_date: '', responsibilities: '' });
    const [expErrors, setExpErrors] = useState<Record<string, string>>({});

    const handleChange = (setter: React.Dispatch<React.SetStateAction<any>>) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setter((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
        };

    // ── Contacts ───────────────────────────────────────────────────────────────
    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = { user_id: employee.user_id, contact_name: contactForm.contact_name, relationship: contactForm.relationship || null, phone: contactForm.phone || null };
        const opts = { onSuccess: () => { setContactOpen(false); router.reload({ only: ['employee'] }); }, onError: (err: any) => setContactErrors(err) };
        if (contactEdit && contactForm.id) {
            router.put(route('employee.employee-contacts.update', contactForm.id), { contact_name: contactForm.contact_name, relationship: contactForm.relationship || null, phone: contactForm.phone || null }, opts);
        } else {
            router.post(route('employee.employee-contacts.store'), data, opts);
        }
    };

    const handleContactDelete = (id: number) => {
        router.delete(route('employee.employee-contacts.destroy', id), {
            onSuccess: () => router.reload({ only: ['employee'] }),
        });
    };

    // ── Documents ──────────────────────────────────────────────────────────────
    const handleDocSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = { user_id: employee.user_id, document_name: docForm.document_name, document_type: docForm.document_type || null, file_path: docForm.file_path || null };
        const opts = { onSuccess: () => { setDocOpen(false); router.reload({ only: ['employee'] }); }, onError: (err: any) => setDocErrors(err) };
        if (docEdit && docForm.id) {
            router.put(route('employee.employee-documents.update', docForm.id), { document_name: docForm.document_name, document_type: docForm.document_type || null, file_path: docForm.file_path || null }, opts);
        } else {
            router.post(route('employee.employee-documents.store'), data, opts);
        }
    };

    const handleDocDelete = (id: number) => {
        router.delete(route('employee.employee-documents.destroy', id), {
            onSuccess: () => router.reload({ only: ['employee'] }),
        });
    };

    // ── Education ──────────────────────────────────────────────────────────────
    const handleEduSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = { user_id: employee.user_id, degree: eduForm.degree, institution: eduForm.institution || null, year_of_passing: eduForm.year_of_passing ? Number(eduForm.year_of_passing) : null };
        const opts = { onSuccess: () => { setEduOpen(false); router.reload({ only: ['employee'] }); }, onError: (err: any) => setEduErrors(err) };
        if (eduEdit && eduForm.id) {
            router.put(route('employee.employee-education.update', eduForm.id), { degree: eduForm.degree, institution: eduForm.institution || null, year_of_passing: eduForm.year_of_passing ? Number(eduForm.year_of_passing) : null }, opts);
        } else {
            router.post(route('employee.employee-education.store'), data, opts);
        }
    };

    const handleEduDelete = (id: number) => {
        router.delete(route('employee.employee-education.destroy', id), {
            onSuccess: () => router.reload({ only: ['employee'] }),
        });
    };

    // ── Experience ─────────────────────────────────────────────────────────────
    const handleExpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = { user_id: employee.user_id, company_name: expForm.company_name, designation: expForm.designation || null, start_date: expForm.start_date || null, end_date: expForm.end_date || null, responsibilities: expForm.responsibilities || null };
        const opts = { onSuccess: () => { setExpOpen(false); router.reload({ only: ['employee'] }); }, onError: (err: any) => setExpErrors(err) };
        if (expEdit && expForm.id) {
            router.put(route('employee.employee-experience.update', expForm.id), { company_name: expForm.company_name, designation: expForm.designation || null, start_date: expForm.start_date || null, end_date: expForm.end_date || null, responsibilities: expForm.responsibilities || null }, opts);
        } else {
            router.post(route('employee.employee-experience.store'), data, opts);
        }
    };

    const handleExpDelete = (id: number) => {
        router.delete(route('employee.employee-experience.destroy', id), {
            onSuccess: () => router.reload({ only: ['employee'] }),
        });
    };

    const employeeName = employee.full_name || `${employee.first_name} ${employee.last_name}`;

    return (
        <AppLayout title={employeeName} breadcrumbs={breadcrumbs}>
            {/* Profile Overview */}
            <div className="mb-6 rounded-lg border bg-card p-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 md:grid-cols-3 lg:grid-cols-4">
                    <div>
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Name</p>
                        <p className="mt-1 font-semibold">{employeeName}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Code</p>
                        <p className="mt-1">{employee.employee_code ?? '—'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Email</p>
                        <p className="mt-1">{employee.email ?? '—'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Phone</p>
                        <p className="mt-1">{employee.phone ?? '—'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Department</p>
                        <p className="mt-1">{employee.department?.name ?? '—'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Designation</p>
                        <p className="mt-1">{employee.designation?.name ?? '—'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Manager</p>
                        <p className="mt-1">
                            {employee.manager
                                ? employee.manager.full_name || `${employee.manager.first_name} ${employee.manager.last_name}`
                                : '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Status</p>
                        <p className="mt-1">{employee.employment_status}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Hire Date</p>
                        <p className="mt-1">{employee.hire_date ?? '—'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Gender</p>
                        <p className="mt-1">{employee.gender ?? '—'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">City</p>
                        <p className="mt-1">{employee.city ?? '—'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Country</p>
                        <p className="mt-1">{employee.country ?? '—'}</p>
                    </div>
                </div>
            </div>

            {/* Sub-entity Tabs */}
            <Tabs defaultValue="contacts">
                <TabsList>
                    <TabsTrigger value="contacts">Contacts ({employee.contacts.length})</TabsTrigger>
                    <TabsTrigger value="documents">Documents ({employee.documents.length})</TabsTrigger>
                    <TabsTrigger value="education">Education ({employee.education.length})</TabsTrigger>
                    <TabsTrigger value="experience">Experience ({employee.experience.length})</TabsTrigger>
                </TabsList>

                {/* ── Contacts Tab ─────────────────────────────────────────── */}
                <TabsContent value="contacts">
                    <div className="rounded-lg border">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <h3 className="font-semibold">Emergency Contacts</h3>
                            <Button
                                size="sm"
                                onClick={() => {
                                    setContactForm({ id: undefined, contact_name: '', relationship: '', phone: '' });
                                    setContactEdit(false);
                                    setContactErrors({});
                                    setContactOpen(true);
                                }}
                            >
                                Add Contact
                            </Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Relationship</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead className="w-[80px] text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employee.contacts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-muted-foreground py-6 text-center text-sm">
                                            No contacts added yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    employee.contacts.map((c) => (
                                        <TableRow key={c.id}>
                                            <TableCell>{c.contact_name}</TableCell>
                                            <TableCell>{c.relationship ?? '—'}</TableCell>
                                            <TableCell>{c.phone ?? '—'}</TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex justify-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={() => {
                                                            setContactForm({ id: c.id, contact_name: c.contact_name, relationship: c.relationship ?? '', phone: c.phone ?? '' });
                                                            setContactEdit(true);
                                                            setContactErrors({});
                                                            setContactOpen(true);
                                                        }}
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive h-7 w-7"
                                                        onClick={() => handleContactDelete(c.id)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* ── Documents Tab ─────────────────────────────────────────── */}
                <TabsContent value="documents">
                    <div className="rounded-lg border">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <h3 className="font-semibold">Documents</h3>
                            <Button
                                size="sm"
                                onClick={() => {
                                    setDocForm({ id: undefined, document_name: '', document_type: '', file_path: '' });
                                    setDocEdit(false);
                                    setDocErrors({});
                                    setDocOpen(true);
                                }}
                            >
                                Add Document
                            </Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Document Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>File Path</TableHead>
                                    <TableHead className="w-[80px] text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employee.documents.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-muted-foreground py-6 text-center text-sm">
                                            No documents added yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    employee.documents.map((d) => (
                                        <TableRow key={d.id}>
                                            <TableCell>{d.document_name}</TableCell>
                                            <TableCell>{d.document_type ?? '—'}</TableCell>
                                            <TableCell>{d.file_path ?? '—'}</TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex justify-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={() => {
                                                            setDocForm({ id: d.id, document_name: d.document_name, document_type: d.document_type ?? '', file_path: d.file_path ?? '' });
                                                            setDocEdit(true);
                                                            setDocErrors({});
                                                            setDocOpen(true);
                                                        }}
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive h-7 w-7"
                                                        onClick={() => handleDocDelete(d.id)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* ── Education Tab ─────────────────────────────────────────── */}
                <TabsContent value="education">
                    <div className="rounded-lg border">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <h3 className="font-semibold">Education</h3>
                            <Button
                                size="sm"
                                onClick={() => {
                                    setEduForm({ id: undefined, degree: '', institution: '', year_of_passing: '' });
                                    setEduEdit(false);
                                    setEduErrors({});
                                    setEduOpen(true);
                                }}
                            >
                                Add Education
                            </Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Degree</TableHead>
                                    <TableHead>Institution</TableHead>
                                    <TableHead>Year of Passing</TableHead>
                                    <TableHead className="w-[80px] text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employee.education.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-muted-foreground py-6 text-center text-sm">
                                            No education records added yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    employee.education.map((ed) => (
                                        <TableRow key={ed.id}>
                                            <TableCell>{ed.degree}</TableCell>
                                            <TableCell>{ed.institution ?? '—'}</TableCell>
                                            <TableCell>{ed.year_of_passing ?? '—'}</TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex justify-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={() => {
                                                            setEduForm({ id: ed.id, degree: ed.degree, institution: ed.institution ?? '', year_of_passing: ed.year_of_passing ? String(ed.year_of_passing) : '' });
                                                            setEduEdit(true);
                                                            setEduErrors({});
                                                            setEduOpen(true);
                                                        }}
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive h-7 w-7"
                                                        onClick={() => handleEduDelete(ed.id)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* ── Experience Tab ────────────────────────────────────────── */}
                <TabsContent value="experience">
                    <div className="rounded-lg border">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <h3 className="font-semibold">Work Experience</h3>
                            <Button
                                size="sm"
                                onClick={() => {
                                    setExpForm({ id: undefined, company_name: '', designation: '', start_date: '', end_date: '', responsibilities: '' });
                                    setExpEdit(false);
                                    setExpErrors({});
                                    setExpOpen(true);
                                }}
                            >
                                Add Experience
                            </Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Designation</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead className="w-[80px] text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employee.experience.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-muted-foreground py-6 text-center text-sm">
                                            No experience records added yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    employee.experience.map((ex) => (
                                        <TableRow key={ex.id}>
                                            <TableCell>{ex.company_name}</TableCell>
                                            <TableCell>{ex.designation ?? '—'}</TableCell>
                                            <TableCell>{ex.start_date ?? '—'}</TableCell>
                                            <TableCell>{ex.end_date ?? '—'}</TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex justify-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={() => {
                                                            setExpForm({ id: ex.id, company_name: ex.company_name, designation: ex.designation ?? '', start_date: ex.start_date ?? '', end_date: ex.end_date ?? '', responsibilities: ex.responsibilities ?? '' });
                                                            setExpEdit(true);
                                                            setExpErrors({});
                                                            setExpOpen(true);
                                                        }}
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive h-7 w-7"
                                                        onClick={() => handleExpDelete(ex.id)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>

            {/* ── Contact Dialog ──────────────────────────────────────────────── */}
            <BaseDialog
                open={contactOpen}
                onOpenChange={setContactOpen}
                title={contactEdit ? 'Edit Contact' : 'Add Contact'}
                description={contactEdit ? 'Update the contact details.' : 'Add an emergency contact for this employee.'}
                onSubmit={handleContactSubmit}
                onCancel={() => setContactOpen(false)}
                submitLabel={contactEdit ? 'Update' : 'Add'}
            >
                <div>
                    <Label>Contact Name *</Label>
                    <Input name="contact_name" value={contactForm.contact_name} onChange={handleChange(setContactForm)} required />
                    {contactErrors.contact_name && <p className="text-sm text-red-500">{contactErrors.contact_name}</p>}
                </div>
                <div>
                    <Label>Relationship</Label>
                    <Input name="relationship" value={contactForm.relationship} onChange={handleChange(setContactForm)} />
                    {contactErrors.relationship && <p className="text-sm text-red-500">{contactErrors.relationship}</p>}
                </div>
                <div>
                    <Label>Phone</Label>
                    <Input name="phone" value={contactForm.phone} onChange={handleChange(setContactForm)} />
                    {contactErrors.phone && <p className="text-sm text-red-500">{contactErrors.phone}</p>}
                </div>
            </BaseDialog>

            {/* ── Document Dialog ─────────────────────────────────────────────── */}
            <BaseDialog
                open={docOpen}
                onOpenChange={setDocOpen}
                title={docEdit ? 'Edit Document' : 'Add Document'}
                description={docEdit ? 'Update document details.' : 'Add a document record for this employee.'}
                onSubmit={handleDocSubmit}
                onCancel={() => setDocOpen(false)}
                submitLabel={docEdit ? 'Update' : 'Add'}
            >
                <div>
                    <Label>Document Name *</Label>
                    <Input name="document_name" value={docForm.document_name} onChange={handleChange(setDocForm)} required />
                    {docErrors.document_name && <p className="text-sm text-red-500">{docErrors.document_name}</p>}
                </div>
                <div>
                    <Label>Document Type</Label>
                    <Input name="document_type" value={docForm.document_type} onChange={handleChange(setDocForm)} placeholder="NID, CV, Certificate…" />
                    {docErrors.document_type && <p className="text-sm text-red-500">{docErrors.document_type}</p>}
                </div>
                <div>
                    <Label>File Path</Label>
                    <Input name="file_path" value={docForm.file_path} onChange={handleChange(setDocForm)} />
                    {docErrors.file_path && <p className="text-sm text-red-500">{docErrors.file_path}</p>}
                </div>
            </BaseDialog>

            {/* ── Education Dialog ────────────────────────────────────────────── */}
            <BaseDialog
                open={eduOpen}
                onOpenChange={setEduOpen}
                title={eduEdit ? 'Edit Education' : 'Add Education'}
                description={eduEdit ? 'Update education details.' : 'Add an education record for this employee.'}
                onSubmit={handleEduSubmit}
                onCancel={() => setEduOpen(false)}
                submitLabel={eduEdit ? 'Update' : 'Add'}
            >
                <div>
                    <Label>Degree *</Label>
                    <Input name="degree" value={eduForm.degree} onChange={handleChange(setEduForm)} required />
                    {eduErrors.degree && <p className="text-sm text-red-500">{eduErrors.degree}</p>}
                </div>
                <div>
                    <Label>Institution</Label>
                    <Input name="institution" value={eduForm.institution} onChange={handleChange(setEduForm)} />
                    {eduErrors.institution && <p className="text-sm text-red-500">{eduErrors.institution}</p>}
                </div>
                <div>
                    <Label>Year of Passing</Label>
                    <Input name="year_of_passing" type="number" value={eduForm.year_of_passing} onChange={handleChange(setEduForm)} placeholder="e.g. 2020" min="1900" max="2100" />
                    {eduErrors.year_of_passing && <p className="text-sm text-red-500">{eduErrors.year_of_passing}</p>}
                </div>
            </BaseDialog>

            {/* ── Experience Dialog ───────────────────────────────────────────── */}
            <BaseDialog
                open={expOpen}
                onOpenChange={setExpOpen}
                title={expEdit ? 'Edit Experience' : 'Add Experience'}
                description={expEdit ? 'Update experience details.' : 'Add a work experience record for this employee.'}
                onSubmit={handleExpSubmit}
                onCancel={() => setExpOpen(false)}
                submitLabel={expEdit ? 'Update' : 'Add'}
            >
                <div>
                    <Label>Company Name *</Label>
                    <Input name="company_name" value={expForm.company_name} onChange={handleChange(setExpForm)} required />
                    {expErrors.company_name && <p className="text-sm text-red-500">{expErrors.company_name}</p>}
                </div>
                <div>
                    <Label>Designation</Label>
                    <Input name="designation" value={expForm.designation} onChange={handleChange(setExpForm)} />
                    {expErrors.designation && <p className="text-sm text-red-500">{expErrors.designation}</p>}
                </div>
                <div>
                    <Label>Start Date</Label>
                    <Input name="start_date" type="date" value={expForm.start_date} onChange={handleChange(setExpForm)} />
                    {expErrors.start_date && <p className="text-sm text-red-500">{expErrors.start_date}</p>}
                </div>
                <div>
                    <Label>End Date</Label>
                    <Input name="end_date" type="date" value={expForm.end_date} onChange={handleChange(setExpForm)} />
                    {expErrors.end_date && <p className="text-sm text-red-500">{expErrors.end_date}</p>}
                </div>
                <div>
                    <Label>Responsibilities</Label>
                    <textarea
                        name="responsibilities"
                        value={expForm.responsibilities}
                        onChange={handleChange(setExpForm)}
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                        placeholder="Describe responsibilities…"
                    />
                    {expErrors.responsibilities && <p className="text-sm text-red-500">{expErrors.responsibilities}</p>}
                </div>
            </BaseDialog>
        </AppLayout>
    );
}
