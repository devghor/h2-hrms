Generate a full CRUD for Division (similar to the existing Company CRUD).
#file:Company
Entity name: Division
Fields:

name (string, required)

description (string, nullable)

File structure and naming should match the Company CRUD but inside a Division folder instead of Company:

Controller

app/Http/Controllers/Configuration/Division/DivisionController.php

Model

app/Models/Configuration/Division/Division.php

Repository (should extend CoreRepository)

app/Repositories/Configuration/Division/DivisionRepository.php

Form Requests

app/Http/Requests/Configuration/Division/StoreDivisionRequest.php

app/Http/Requests/Configuration/Division/UpdateDivisionRequest.php

Resource/Response

app/Http/Resources/Configuration/Division/DivisionResource.php

Routes

Update routes/web.php with RESTful routes for divisions (similar to companies).

Frontend (React + Inertia)

Update resources/js/config/nav.ts → Add navigation entry for Divisions under Configuration.

Create resources/js/pages/configuration/divisions/index.tsx (list, create, update, delete UI).

Follow Laravel conventions and reuse the same structure, validation style, and Inertia patterns used in the Company CRUD.
