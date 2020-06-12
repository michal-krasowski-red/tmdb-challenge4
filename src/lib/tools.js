export const getImgUrl = (imgPath, width = 185)=> {
    return `//image.tmdb.org/t/p/w${width}${imgPath}`
};
export const defaultEasing = {duration: 2, timingFunction: 'cubic-bezier(0.20, 1.00, 0.80, 1.00)'};
