import PackingChecklist from "../components/TravelPackingChecklist/PackingChecklist";
import React from "react";

const PackingChecklistPage = () => {
    return (
        <div className="mx-auto p-10 min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-pink-900 overflow-x-hidden pt-20">
            <PackingChecklist/>
        </div>
    )
}

export default PackingChecklistPage;