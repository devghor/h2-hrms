Generate a full CRUD for Desk (similar to the existing Division CRUD).
#file:Division
Entity name: Desk

Fields:
name (string, required)
division_id (integer)
description (string, nullable)

Add Migration
database/migrations

File structure and naming should match the Division CRUD but inside a Department folder instead of Division:

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

resources/js/config/breadcrumbs.ts

Follow Laravel conventions and reuse the same structure, validation style, and Inertia patterns used in the Company CRUD.
