export default  {
    isObjNull: (data) => {
        return (JSON.stringify(data) == "{}")
    }
};