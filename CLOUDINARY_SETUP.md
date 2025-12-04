# Cloudinary Image Storage Setup

## Why Cloudinary?
- **Permanent Storage**: Images never get deleted (unlike Render)
- **Global CDN**: Fast image delivery worldwide
- **Auto Optimization**: Automatic image compression and format conversion
- **Free Tier**: 25GB storage, 25GB bandwidth per month
- **Full URLs**: Direct access without server dependencies

## Setup Instructions

### 1. Create Cloudinary Account
1. Go to https://cloudinary.com/
2. Sign up for free account
3. Get your credentials from Dashboard

### 2. Set Environment Variables in Render
```
CLOUDINARY_CLOUD_NAME=dbzx5y9ds
CLOUDINARY_API_KEY=511921135832342
CLOUDINARY_API_SECRET=FAIHZMs4RBaHmDJI51k68RvGRnk
```

### 3. Install Cloudinary Package
```bash
npm install cloudinary
```

### 4. API Endpoints

#### Upload Gallery Image
```
POST /api/cloudinary/gallery
Content-Type: multipart/form-data

{
  "image": [file],
  "title": "Image Title",
  "description": "Description",
  "category": "general"
}
```

#### Upload Video
```
POST /api/cloudinary/video
Content-Type: multipart/form-data

{
  "video": [file],
  "title": "Video Title",
  "description": "Description", 
  "category": "general"
}
```

#### Get Gallery Items
```
GET /api/cloudinary/gallery?category=general&page=1&limit=20
```

#### Delete Item
```
DELETE /api/cloudinary/:id
```

## Benefits
- ✅ **No File Loss**: Images persist forever
- ✅ **Fast Loading**: Global CDN delivery
- ✅ **Auto Optimization**: Compressed images
- ✅ **Full URLs**: https://res.cloudinary.com/...
- ✅ **Backup**: Cloudinary handles backups
- ✅ **Scalable**: Handles unlimited uploads

## Image URLs
All images stored with full Cloudinary URLs:
```
https://res.cloudinary.com/your-cloud/image/upload/v1234567890/ngo-gallery/general/image-name.jpg
```

These URLs work directly in frontend without backend dependency.