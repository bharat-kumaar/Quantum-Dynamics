const fs = require('fs');
const path = require('path');
const Media = require('../models/media');
const Project = require('../models/project');
const sendResponse = require('../utils/responseHandler');

// ============================================
// 1. UPLOAD MEDIA FILE & LINK TO PROJECT
// ============================================
const uploadFile = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return sendResponse(res, 400, false, "No file is uploaded!");
        }

        const file = req.files[0];
        const { projectId } = req.body; 

        // 1. Database mein media ki entry banao
        const newMedia = await Media.create({
            originalName: file.originalname,
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
            uploadedBy: req.user.id,
            project: projectId || null
        });

        // 2. Agar frontend ne Project ID bheji hai, toh us Project mein is file ko link kar do
        if (projectId) {
            await Project.findByIdAndUpdate(
                projectId, 
                { $push: { attachments: newMedia._id } }
            );
        }

        sendResponse(res, 201, true, "File successfully uploaded and saved in database!", newMedia);
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
};

// ============================================
// 2. GET ALL MEDIA ASSETS (FROM MONGODB DIRECTLY)
// ============================================
const getMediaAssets = async (req, res) => {
    try {
        const { projectId, type } = req.query;
        let filter = {};

        // Filter by Project ID
        if (projectId) {
            filter.project = projectId;
        }

        // Smart Category Filter
        if (type) {
            const cleanType = type.toLowerCase().trim();
            if (cleanType === 'document') {
                filter.mimetype = { $regex: 'pdf|document|text|sheet|presentation|msword|wordprocessingml', $options: 'i' };
            } else if (cleanType === 'archive') {
                filter.mimetype = { $regex: 'zip|compressed|tar|rar|7z', $options: 'i' };
            } else {
                filter.mimetype = { $regex: cleanType, $options: 'i' };
            }
        }

        const mediaList = await Media.find(filter)
            .sort({ createdAt: -1 })
            .populate('uploadedBy', 'name email')
            .populate('project', 'name client');

        sendResponse(res, 200, true, "Media assets fetched successfully", mediaList);
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
};

// ============================================
// 3. GET SINGLE FILE DIRECTLY (FAST STREAM & CACHE)
// ============================================
const getSingleFile = async (req, res) => {
    try {
        const { filename } = req.params;
        const candidatePaths = [
            path.join(__dirname, '../../uploads', filename),
            path.join(__dirname, '../uploads', filename),
            path.join(process.cwd(), 'quantum-dynamics-backend', 'uploads', filename),
            path.join(process.cwd(), 'uploads', filename)
        ];

        let filePath = candidatePaths.find(p => fs.existsSync(p));

        if (filePath) {
            res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
            return res.sendFile(filePath);
        } else {
            return sendResponse(res, 404, false, "File not found on server!");
        }
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};

// ============================================
// 4. DELETE ASSET
// ============================================
const deleteFile = async (req, res) => {
    try {
        const { id } = req.params;

        const media = await Media.findById(id);
        
        if (!media) {
            return sendResponse(res, 404, false, "Media asset not found in database.");
        }

        const candidatePaths = [
            path.join(__dirname, '../../uploads', media.filename),
            path.join(__dirname, '../uploads', media.filename),
            path.join(process.cwd(), 'quantum-dynamics-backend', 'uploads', media.filename),
            path.join(process.cwd(), 'uploads', media.filename)
        ];

        const filePath = candidatePaths.find(p => fs.existsSync(p));
        if (filePath) {
            fs.unlinkSync(filePath);
        }

        await Media.findByIdAndDelete(id);

        if (media.project) {
            await Project.findByIdAndUpdate(media.project, {
                $pull: { attachments: id }
            });
        }

        sendResponse(res, 200, true, "Asset deleted successfully from server and database.");
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
};

module.exports = {
    uploadFile,
    getMediaAssets,
    getSingleFile,
    deleteFile
};
