<?php

namespace App\Http\Controllers\Employee\EmployeeDocument;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\EmployeeDocument\StoreEmployeeDocumentRequest;
use App\Http\Requests\Employee\EmployeeDocument\UpdateEmployeeDocumentRequest;
use App\Repositories\Employee\EmployeeDocument\EmployeeDocumentRepository;

class EmployeeDocumentController extends Controller
{
    public function __construct(private EmployeeDocumentRepository $documentRepository) {}

    public function store(StoreEmployeeDocumentRequest $request)
    {
        $this->documentRepository->create($request->validated());

        return redirect()->back()->with('success', 'Document added successfully.');
    }

    public function update(UpdateEmployeeDocumentRequest $request, string $id)
    {
        $this->documentRepository->update($request->validated(), $id);

        return redirect()->back()->with('success', 'Document updated successfully.');
    }

    public function destroy(string $id)
    {
        $this->documentRepository->delete($id);

        return redirect()->back()->with('success', 'Document deleted successfully.');
    }
}
