// plugin deletes all console.log in code
// and changes the exponentiation expression from a ** b to Math.pow(a, b)

module.exports = function myPlugin() {
    return {
        name: 'my-plugin',
        visitor: {
            CallExpression(path) {
                const { node: { callee } } = path;
                const { object, property } = callee;
                const isLogProp = property && property.name === 'log';
                const isConsoleObj = object && object.name === 'console';

                if (isConsoleObj && isLogProp) {
                    path.remove();
                }
            },
            BinaryExpression(path) {
                if (path.node.operator === '**') {
                    path.replaceWithSourceString(`Math.pow(${path.node.left.value}, ${path.node.right.value})`);
                }
            },
        },
    };
};
