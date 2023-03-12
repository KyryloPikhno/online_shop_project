const regexp = {
    EMAIL: /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/,
    PASSWORD: /^[a-zA-Z0-9]+ ?([a-zA-Z0-9]+$){0,20}$/,
    MONGO_ID: /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i,
    NAME: /^[a-zA-Z0-9]+ ?([a-zA-Z0-9]+$){1,20}$/,
    SEARCH: /^[a-zA-Z0-9]+ ?([a-zA-Z0-9]+$){0,20}$/,
    COUNTRY: /^[a-zA-ZА-яёЁіІїЇҐґєЄ]{1,20}$/,
    CITY: /^[a-zA-ZА-яёЁіІїЇҐґєЄ]{1,20}$/
};

export {regexp};