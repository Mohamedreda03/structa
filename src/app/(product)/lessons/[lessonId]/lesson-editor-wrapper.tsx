"use client";

import dynamic from "next/dynamic";

const LessonEditor = dynamic(() => import("./lesson-editor"), { ssr: false });

interface LessonEditorWrapperProps {
    lesson: {
        id: string;
        title: string;
        sections: {
            id: string;
            title: string;
            content: string;
        }[];
    };
}

export default function LessonEditorWrapper({ lesson }: LessonEditorWrapperProps) {
    return <LessonEditor lesson={lesson} />;
}
