import ClientCompopnent from '@/layouts/ClientComponent'
import { HomeLayouts } from '@/layouts/HomeLayouts'
import SearchResult from '@/views/SearchResultView'
import React from 'react'

export default function page() {
    return (
        <ClientCompopnent>
            <HomeLayouts>
                <SearchResult />
            </HomeLayouts>
        </ClientCompopnent>
    )
}
