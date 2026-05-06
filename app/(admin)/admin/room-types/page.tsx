"use client";
import React from "react";
import { useAdmin } from "@/app/components/AdminContext";
import RoomManagement from "@/app/components/RoomManagement";

export default function AdminRoomTypesPage() {
    const { roomTypes, rooms, amenityCats, addRoomType, editRoomType, deleteRoomType } = useAdmin();

    return (
        <RoomManagement 
            rooms={roomTypes} 
            inventory={rooms}
            amenityCats={amenityCats} 
            onAdd={addRoomType} 
            onEdit={editRoomType} 
            onDelete={deleteRoomType} 
        />
    );
}
