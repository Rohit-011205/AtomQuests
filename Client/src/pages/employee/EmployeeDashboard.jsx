import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../services/api";

export default function EmployeeDashboard() {
    const [goals, setGoals] = useState([]);
    const [title, setTitle] = useState("");
    const [target, setTarget] = useState("");

    // Fetch goals on mount
    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const res = await axiosInstance.get("/goals");
                setGoals(res.data);
            } catch (err) {
                console.error("Failed to fetch goals", err);
            }
        };
        fetchGoals();
    }, []);

    // Create new goal
    const handleCreateGoal = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post("/goals", {
                title,
                target,
                weightage: 20,
                uom: "numeric",
            });
            setGoals([...goals, res.data]);
            setTitle("");
            setTarget("");
            alert("Goal created!");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to create goal");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Employee Dashboard</h1>

            {/* Create Goal Form */}
            <form onSubmit={handleCreateGoal} className="bg-white p-4 rounded shadow-md mb-6 space-y-4 w-96">
                <h2 className="text-xl font-semibold">Create Goal</h2>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Goal Title"
                    className="w-full p-2 border rounded"
                />
                <input
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="Target"
                    className="w-full p-2 border rounded"
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Create Goal
                </button>
            </form>

            {/* Goals List */}
            <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-xl font-semibold mb-4">My Goals</h2>
                {goals.length === 0 ? (
                    <p className="text-gray-500">No goals yet.</p>
                ) : (
                    <ul className="space-y-2">
                        {goals.map((goal) => (
                            <li key={goal._id} className="p-2 border rounded flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{goal.title}</p>
                                    <p className="text-sm text-gray-600">Target: {goal.target} | Status: {goal.status}</p>
                                </div>
                                <button
                                    onClick={() => alert("Check-in form will go here")}
                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                >
                                    Check-in
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
