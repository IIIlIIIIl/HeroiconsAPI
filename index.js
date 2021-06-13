const config = require('./config.json'),
    express = require('express'),
    app = express(),
    port = config.port
    axios = require('axios');

let iconList = []

app.get("/", (req, res) => {
    res.json({
        message: "👋 Hello World !",
        credit: "❤ IIIlIIIIl on github",
        endpoints: {
            getIcon: "/icon/:iconName/:type",
            getIconsName: '/icons'
        }
    })
})

app.get('/icons', async (req, res) => {
    if(iconList.length > 1) return res.json(iconList);
    let icons = (await axios.get("https://api.github.com/repos/tailwindlabs/heroicons/git/trees/master?recursive=1")).data;
    icons = icons.tree;

    icons.forEach(icon => {
        if(icon.path.includes("src/solid/") && !icon.path.includes('.DS_Store')){
            const iconName = icon.path.replace('src/solid/', '').replace('.svg', '')
            iconList.push(iconName)
        }
    })
    res.json(iconList)
})

app.get(`/icon/:iconName/:type`, async (req, res) => {
    const parms = req.params;
    console.log(config.baseURL.replace('{type}', parms.type).replace('{iconName}', parms.iconName))
    try {
        const icon = (await axios.get(config.baseURL.replace('{type}', parms.type).replace('{iconName}', parms.iconName))).data;
        res.send(icon)
    } catch (e) {
        res.json({
            status: e.response.status,
            error: 'Icon not found'
        })
    }
})

app.listen(port, () => {
    console.log(`Server started !`)
})
