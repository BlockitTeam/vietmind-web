import React from 'react'
import { Input } from "@/components/ui/input";
import { useConversationContext } from './conversations-provider';
import { Search } from 'lucide-react';

export default function SearchConversation() {
  const { setSearchTerm } = useConversationContext();
    return (
        <div className="relative ">
            <Input
                className="pr-9 border-regal-green"
                placeholder="Tìm tên"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
        </div>
    )
}
