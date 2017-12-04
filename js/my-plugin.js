// plugin deletes all console.log in code
// and changes the exponentiation expression from 1 ** 5 to 5 ** 1

module.exports = function myPlugin({ types: t }) {
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
            // BinaryExpression(path) {
            //     path.replaceWith(t.binaryExpression('**', path.node.right, path.node.left));
            //     path.stop();
            // },
        },
    };
};
