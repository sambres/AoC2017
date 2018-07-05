
// http://blog.revathskumar.com/2014/12/javascript-currying-and-chaining.html
//export default const fn = (data) =>  {
exports.fn = (data) => {
    let out = data;
    return {
        then: function (func) {
            this.data = func(this.data);
            return this;
        },
        data: out,
    };
};