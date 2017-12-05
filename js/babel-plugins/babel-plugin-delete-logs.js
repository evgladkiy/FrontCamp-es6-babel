// plugin deletes all console.log in code

module.exports = function logPlugin() {
    return {
        name: 'babel-plugin-delete-logs',
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
        },
    };
};
