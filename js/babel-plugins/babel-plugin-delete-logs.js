// plugin deletes all console.log in code

module.exports = function logPlugin() {
    return {
        name: 'logPlugin',
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
                const { node } = path;
                const { operator } = node;
                const { left: { value: valueLeft } } = node;
                const { right: { value: valueRight } } = node;

                if (operator === '**') {
                    path.replaceWithSourceString(`Math.pow(${valueLeft}, ${valueRight})`);
                }
            },
        },
    };
};
