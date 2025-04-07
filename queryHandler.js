export const analyzeQuery = (query) => {
    const response = [];
    let tt = [], t;
    if (query.greet) {
        t = query.greet;
        tt = Array.isArray(t) ? t : [t];
        response.push(`Hello ${tt.join(", ")}!`);
    }
    if (query.great) {
        t = query.great
        tt = Array.isArray(t) ? t : [t];
        response.push(`Great ${tt.join(", ")}!`);
    }
    if (query.calculate) {
        t = query.calculate;
        tt = Array.isArray(t) ? t : [t];
        let calc = tt.map(num => Number(num) * 2);
        response.push(`(${tt.join(', ')}) * 2 = ${calc.join(", ")}`);
    }
    return response;



    // if (query.greet) {
    //     const names = Array.isArray(query.greet) ? query.greet : [query.greet];
    //     response.push({
    //         action: "greeting",
    //         result: `Hello ${names.join(", ")}!`
    //     });
    // }
    // if (query.great) {
    //     const names = Array.isArray(query.great) ? query.greet : [query.great];
    //     response.push({
    //         action: "great",
    //         result: `Great ${names.join(", ")}!`
    //     });
    // }
    // if (query.calculate) {
    //     const numbers = Array.isArray(query.calculate) ? query.calculate : [query.calculate];
    //     const calculations = numbers.map(num => Number(num) * 2);
    //     response.push({
    //         action: "calculation",
    //         result: calculations.join(", ")
    //     });
    // }
    // if (response.length === 0) {
    //     response.push({
    //         action: "no_params",
    //         result: "Add query parameters to the URL"
    //     });
    // }
    // return response;
};
