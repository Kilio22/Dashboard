const User = require('../models/User');

function isGridConfigValid(widget) {
    return !(!widget.hasOwnProperty('x') ||
        !widget.hasOwnProperty('y') ||
        !widget.hasOwnProperty('id') ||
        !widget.hasOwnProperty('type') ||
        !widget.hasOwnProperty('refreshRate')
    );
}

async function updateWidgetGridConfig(user, widget) {
    await User.updateOne({ 'widgetsConfig.id': widget.id }, {
        $set: {
            'widgetsConfig.$.type': widget.type,
            'widgetsConfig.$.x': widget.x,
            'widgetsConfig.$.y': widget.y,
            'widgetsConfig.$.refreshRate': widget.refreshRate
        }
    });
}

async function updateWidgetQueryConfig(user, widget) {
    await User.updateOne({ _id: user._id }, {
        $pull: {
            widgetsConfig: {
                id: widget.id
            }
        }
    });
}

async function addWidgetWithGridConfig(user, widget) {
    await User.updateOne({ _id: user._id }, {
        $push: {
            widgetsConfig: {
                id: widget.id,
                type: widget.type,
                x: widget.x,
                y: widget.y,
                refreshRate: widget.refreshRate
            }
        }
    });
}

async function storeWidgetsGridConfig(givenWidgets, user) {
    for (const widget of givenWidgets) {
        if (!isGridConfigValid(widget)) {
            throw {
                expressRes: {
                    message: 'missing property',
                    code: 400
                }
            };
        }

        const storedWidgetIndex = user.widgetsConfig.findIndex((storedWidget) => {
            return storedWidget.id === widget.id;
        });
        if (storedWidgetIndex === -1) {
            await addWidgetWithGridConfig(user, widget);
            continue;
        }
        await updateWidgetGridConfig(user, widget);
    }
}

function isQueryConfigValid(widget) {
    return !(!widget.hasOwnProperty('query') || !widget.hasOwnProperty('id'));
}

async function storeWidgetsQueryConfig(givenWidgets, user) {
    for (const widget of givenWidgets) {
        if (!isQueryConfigValid(widget)) {
            throw {
                expressRes: {
                    message: 'missing property',
                    code: 400
                }
            };
        }

        const storedWidgetIndex = user.widgetsConfig.findIndex((storedWidget) => {
            return storedWidget.id === widget.id;
        });
        if (storedWidgetIndex === -1) {
            throw {
                expressRes: {
                    message: `widget with id ${widget.id} does not exist`,
                    code: 400
                }
            };
        }
        await User.updateOne({ 'widgetsConfig.id': widget.id }, {
            $set: {
                'widgetsConfig.$.query': widget.query
            }
        });
    }
}

async function deleteWidgets(givenWidgets, user) {
    for (const widget of givenWidgets) {
        if (!widget.hasOwnProperty('id')) {
            throw {
                expressRes: {
                    message: 'missing property',
                    code: 400
                }
            };
        }
        await updateWidgetQueryConfig(user, widget);
    }
}

module.exports = {
    storeWidgetsGridConfig,
    storeWidgetsQueryConfig,
    deleteWidgets
};
