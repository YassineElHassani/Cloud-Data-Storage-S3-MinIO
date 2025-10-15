import dotenv from "dotenv";
dotenv.config();

import { Client } from "minio";

const minioClient = new Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: Number(process.env.MINIO_PORT),
    useSSL: process.env.MINIO_USE_SLL === "true",
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});

async function createBucket(bucketName) {
    const exists = await minioClient.bucketExists(bucketName);

    if (!exists) {
        await minioClient.makeBucket(bucketName);
        console.log(`\n ${bucketName}: has been created successfully`);
    } else {
        console.log(`\n ${bucketName}: already exists`);
    }
}

createBucket("first");

async function uploadFile(bucketName, objectName, pathFile) {
    try {
        await minioClient.fPutObject(bucketName, objectName, pathFile);
        console.log(`\n ${objectName}: has been uploaded successfully`);
    } catch (error) {
        console.log(`\n Server Error: ${error}`);
    }
}

uploadFile("first", "first_object.gif", "./image_download.gif");

async function downloadFile(bucketName, objectName, destPath) {
    try {
        await minioClient.fGetObject(bucketName, objectName, destPath);
        console.log(`\n ${objectName}: has been downloaded successfully`);
    } catch (error) {
        console.log(`\n Server Error: ${error}`);
    }
}

downloadFile("first", "first_object.gif", "./download/image.gif");

async function deleteObject(bucketName, objectName) {
    try {
        await minioClient.removeObject(bucketName, objectName);
        console.log(`\n ${objectName}: has been deleted successfully`);
    } catch (error) {
        console.log(`\n Server Error: ${error}`);
    }
}

deleteObject("first", "first_object.gif");

async function getPresignedURL(bucketName, objectName, secondsExpire = 10) {
    const url = await minioClient.presignedGetObject(bucketName, objectName, secondsExpire);
    console.log(`Presigned URL: ${url}`);
    return url;
}

getPresignedURL("first", "code.png", 10);


