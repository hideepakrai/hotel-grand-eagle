"use client";
import React from "react";
import { useAdmin } from "@/app/components/AdminContext";
import ReportsPage from "@/app/components/Reports";

export default function AdminReportsPage() {
    const { bookings, mealPlans, hkTasks, roomTypes, rooms } = useAdmin();

    return (
        <ReportsPage 
            bookings={bookings} 
            rooms={roomTypes} 
            inventory={rooms}
            mealPlans={mealPlans}
            hkTasks={hkTasks}
        />
    );
}
