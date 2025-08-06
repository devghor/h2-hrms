const useSorting = (initialParams: any, setParams: any) => {
    const sort = (column: any) => {
        setParams((prevParams: any) => ({
            ...prevParams,
            col: column,
            sort: prevParams.sort ? (prevParams.sort === 'asc' ? 'desc' : 'asc') : 'asc',
        }));
    };

    return { sort };
};

export default useSorting;
