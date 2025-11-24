# CSV Import API Documentation

## Overview

The CSV import API allows clients to upload CSV files containing investor/prospect data and automatically normalize them into the unified Prospect schema used throughout the application.

## Endpoint

**POST** `/api/import/csv`

## Request Format

The endpoint accepts a `multipart/form-data` request with the following fields:

- **`file`** (required): CSV file to import
- **`source`** (optional): Source type identifier (default: `'openvc'`)
  - Options: `'openvc'`, `'angelmatch'`, `'manual'`, `'event'`, `'referral'`
- **Query Parameter `saveToDb`** (optional): Whether to save prospects to MongoDB (default: `false`)
  - Set to `true` to automatically save imported prospects to the database

## Response Format

### Success Response (200)

```json
{
  "success": true,
  "count": 2545,
  "prospects": [...],  // First 100 prospects for preview
  "saved": 2545,       // Only present if saveToDb=true
  "message": "Successfully imported 2545 prospects (2545 saved to database)"
}
```

### Error Responses

#### 400 - Bad Request
```json
{
  "success": false,
  "error": "No file provided",
  "message": "Please provide a CSV file in the \"file\" field"
}
```

#### 500 - Internal Server Error
```json
{
  "success": false,
  "error": "Failed to import CSV",
  "message": "Error details..."
}
```

## CSV Format

Currently, the API supports **OpenVC CSV format** with the following required columns:

- `Investor name`
- `Website`
- `Global HQ`
- `Countries of investment` (comma-separated)
- `Stage of investment` (comma-separated with numeric prefixes, e.g., "1. Idea or Patent,2. Prototype")
- `Investment thesis`
- `Investor type` (e.g., "VC", "Solo angel", "Angel network")
- `First cheque minimum` (e.g., "$10000")
- `First cheque maximum` (e.g., "$200000")

## Usage Examples

### JavaScript/TypeScript (Browser)

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('source', 'openvc');

const url = new URL('/api/import/csv', window.location.origin);
url.searchParams.set('saveToDb', 'true');

const response = await fetch(url.toString(), {
  method: 'POST',
  body: formData
});

const data = await response.json();

if (data.success) {
  console.log(`Imported ${data.count} prospects`);
  if (data.saved) {
    console.log(`${data.saved} saved to database`);
  }
} else {
  console.error('Import failed:', data.message);
}
```

### cURL

```bash
curl -X POST \
  "http://localhost:3000/api/import/csv?saveToDb=true" \
  -F "file=@OpenVC_Oct2025.csv" \
  -F "source=openvc"
```

### React Component Example

```jsx
import { useState } from 'react';
import CsvUploadModal from '@/app/dashboard/components/CsvUploadModal';

function MyComponent() {
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <>
      <button onClick={() => setUploadOpen(true)}>
        Import CSV
      </button>
      
      <CsvUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onImportSuccess={(count, saved) => {
          console.log(`Imported ${count} prospects`);
          // Refresh your prospects list here
        }}
      />
    </>
  );
}
```

## Normalization Process

The API automatically normalizes CSV data into the unified Prospect schema:

1. **Countries**: Parsed from comma-separated string into array
2. **Stages**: Normalized from "1. Idea or Patent" format to enum values (`idea`, `prototype`, `early_revenue`, `scaling`, `growth`, `pre_ipo`)
3. **Investor Type**: Mapped to enum (`vc`, `solo_angel`, `angel_network`, `corporate_vc`, `family_office`, `accelerator`, `pe`, `public_fund`, `revenue_based`, `other`)
4. **Check Sizes**: Parsed from "$10,000" format to numeric USD values
5. **ID Generation**: Creates stable MD5 hash from `source:name:website`

## Database Integration

If `saveToDb=true` and MongoDB is configured:

- Prospects are saved to the `prospects` collection
- Uses upsert logic (updates existing or creates new based on `id`)
- Adds metadata: `createdAt`, `updatedAt`, `importedAt`, `importSource`
- Returns count of saved/updated records

If MongoDB is not configured, the import still works but skips database saving (with a warning in logs).

## Error Handling

The API handles various error cases:

- Missing file → 400 error
- Invalid file type → 400 error
- Empty CSV or no valid prospects → 400 error
- Database save failures → Logged but don't fail the request
- MongoDB not configured → Warning logged, import still succeeds

## Future Enhancements

- Support for other CSV formats (AngelMatch, custom mappings)
- Column mapping UI for custom CSV formats
- Batch processing for very large files
- Progress tracking for long-running imports
- Validation and preview before import
- Duplicate detection and merging

