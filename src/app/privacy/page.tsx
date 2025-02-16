"use client";
import React from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import TabEnglish from "./components/TabEnglish";
import TabVietnamese from "./components/TabVietnamese";


export default function PrivacyPage() {
    const onChange = (key: string) => {
        console.log(key);
    };
    
    const items: TabsProps["items"] = [
        {
            key: "1",
            label: "English",
            children: <TabEnglish />
        },
        {
            key: "2",
            label: "Vietnamese",
            children: <TabVietnamese />
        },
    ];
    return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
}
