export const isHomePage = (path:string) => {
	return path == "/"
}

export const isShipPage = (path:string) => {
    return path.match(/^\/ships\/(\d+)/)
}