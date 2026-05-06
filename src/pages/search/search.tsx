
import SearchView from "@/sections/search/search-view"
import { CONFIG } from "../../config-global"

const metadata = { title: `Search - ${CONFIG.appName}` }

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <SearchView />
        </>
    )
}
