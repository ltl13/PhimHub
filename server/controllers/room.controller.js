const argon2 = require("argon2");
//const { confirmAccess } = require("../shared/functions");

const Room = require("../models/Room");

const getAllRooms = async (req, res) => {
    // const confirm = await confirmAccess({
    //     role: req.body.role,
    //     func: "getAllRooms",
    // });
    // if (!confirm) return res.redirect("back");

    try {
        const allRooms = await Room.find({ status: true }).populate({
            path: "roomType",
            select: "typeName"
        })
        return res.status(200).json({
            success: true,
            allRooms
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const getRoomById = async (req, res) => {
    // const confirm = await confirmAccess({
    //     role: req.body.role,
    //     func: "getRoomById",
    // });

    try {
        const room = await Room.findById(req.params.id).populate({
            path: "roomType",
            select: "typeName"
        })

        if (!room) {
            return res.status(406).json({
                success: false,
                message: "Room not found"
            })
        }

        return res. status(200).json({
            success: true,
            room
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Intenal server error"
        })
    }
}

const createRoom = async (req, res) => {
    // Check if user can access this route
    // const confirm = await confirmAccess({
    //     role: req.body.role,
    //     func: "createRoom",
    // });
    // if (!confirm) return res.redirect("back");

    try {
        const {
            name,
            status,
            numberSeat,
            capacity,
            roomType
        } = req.body;

        const newRoom = new Room({
            name,
            status,
            numberSeat,
            capacity,
            roomType
        })
        await newRoom.save();

        return res.status(200).json({
            success: true,
            message: "New room was creatd successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

const updateRoomById = async (req, res) => {
    // Check if user can access this route
    // const confirm = await confirmAccess({
    //     role: req.body.role,
    //     func: "updateRoomById",
    // });
    // if (!confirm) return res.redirect("back");

    try {
        const {
            name,
            status,
            numberSeat,
            capacity,
            roomType
        } = req.body;

        const room = await Room.findOne({
            _id: req.params.id
        })

        if (!room) {
            return res.status(406).json({
                status: false,
                message: "Room not found"
            })
        }

        await Room.findOneAndUpdate(
            { _id: req.params.id},
            {
                name,
                status,
                numberSeat,
                capacity,
                roomType
            },
            { new: true}
        ).then((result) => result.save());

        return res.status(200).json({
            success: true,
            message: "Room's infomation has been updated successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const deleteRoomById = async (req, res) => {
    // Check if user can access this route
    // const confirm = await confirmAccess({
    //     role: req.body.role,
    //     func: "getAllCustomers",
    // });
    // if (!confirm) return res.redirect("back");

    try {
        const delRoom = await Room.findByIdAndUpdate(
            { _id: req.params.id },
            { status: false },
            { new: true }
        )
        if (!delRoom) {
            return res.status(406).json({
                success: false,
                message: "Room not found"
            })
        }
        delRoom.save();
        return res.status(200).json({
            success: true,
            message: "Delete room successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoomById,
    deleteRoomById
}