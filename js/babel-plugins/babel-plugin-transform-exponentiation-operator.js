// plugin changes the exponentiation expression from a ** b to Math.pow(a, b)

module.exports = function powPlugin() {
    return {
        name: 'transform-exponentiation-operator-plugin',
        visitor: {
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
