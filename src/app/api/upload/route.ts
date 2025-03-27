import { NextRequest, NextResponse } from "next/server";
import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

const sasUrl = "https://hellowoldstorageacc.blob.core.windows.net/lmsemployeeimages?sp=racwdlmeop&st=2025-03-27T06:56:30Z&se=2025-03-27T14:56:30Z&sv=2024-11-04&sr=c&sig=PsyKqowx0%2BaluUZNYGHl%2FmWUEWs1kDgQFN1%2BSVDGesY%3D"

const containerName = "lmsemployeeimages";



export async function POST(req: NextRequest) {
    try {
        // Parse form data
        const formData = await req.formData();

        const file = formData.get("file"); // Extract file from request
        console.log("file", file);
        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        if (!(file instanceof File)) {
            return NextResponse.json({ error: "Invalid file uploaded" }, { status: 400 });
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        const blobServiceClient = new BlobServiceClient(sasUrl);
        const containerClient = blobServiceClient.getContainerClient(containerName);

        const blobName = `${uuidv4()}-${file.name}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Upload file to Azure Blob Storage
        await blockBlobClient.uploadData(buffer, {
            blobHTTPHeaders: { blobContentType: file.type },
        });

        const imageUrl = `${sasUrl.split("?")[0]}/${containerName}/${blobName}`;

        return NextResponse.json({ imageUrl });
    } catch (error) {
        console.error("Azure Upload Error:", error);
        return NextResponse.json({ error: `File upload failed ${error}` }, { status: 500 });
    }
}
