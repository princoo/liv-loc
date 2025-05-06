// // import S3 from "aws-sdk/clients/s3";
// import {
//   GetObjectCommand,
//   S3Client,
//   PutObjectCommand,
// } from "@aws-sdk/client-s3";
// import * as dotenv from "dotenv";
// import fs from "fs";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// dotenv.config();

// //AWS keys
// const bucketName = process.env.AWS_BUCKET_NAME;
// const region = process.env.AWS_BUCKET_REGION;
// const accessKeyId = process.env.AWS_ACCES_KEY;
// const secretAccessKey = process.env.AWS_SECRET_KEY;

// //Declaring new S3 client instance
// const s3 = new S3Client({
//   credentials: {
//     accessKeyId: accessKeyId!,
//     secretAccessKey: secretAccessKey!,
//   },
//   region,
// });

// // Upload a file to S3
// export async function uploadFile(file: any) {
//   const fileStream = fs.createReadStream(file.path);

//   const uploadParams = {
//     Bucket: bucketName!,
//     Body: fileStream,
//     Key: file.filename,
//     ContentType: file.mimetype,
//   };

//   const command = new PutObjectCommand(uploadParams);

//   return await s3.send(command);
// }

// //Get imageUrl
// export async function getImageUrl(key: string): Promise<string> {
//   const getObjectParams = {
//     Bucket: bucketName,
//     Key: key,
//   };
//   const command = new GetObjectCommand(getObjectParams);

//   const url = await getSignedUrl(s3, command, { expiresIn: 604800 });
//   return url;
// }


import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // use HTTPS
});

/**
 * Uploads a file to Cloudinary
 * @param file - The file to upload (containing path, filename, and mimetype)
 * @returns Promise resolving to the Cloudinary upload response
 */
export async function uploadFile(file: any) {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      public_id: file.filename, // Use the same filename as in the S3 version
      resource_type: "auto"
    });
    
    return result;
  } catch (error) {
    throw new Error(`Failed to upload file to Cloudinary: ${error}`);
  }
}

export async function getImageUrl(filename: string): Promise<string> {
  return cloudinary.url(filename, {
    secure: true,
    // Adding format auto and quality auto for optimization
    transformation: [{ fetch_format: "auto", quality: "auto" }]
  });
}