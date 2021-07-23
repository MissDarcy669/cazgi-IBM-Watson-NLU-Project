const express = require('express');
const app = new express();
const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const NaturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-11-07',
        authenticator: new IamAuthenticator({
            apikey: {api_key},
        }),
        serviceUrl: {api_url},
    })
    return NaturalLanguageUnderstanding;
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => { 
    
    const analyzeParamsEmotion = {
        'url': req.query.url,
        'features': {
            'emotion': {
                'limit': 5
            }
        }
    }

    getNLUInstance().analyze(analyzeParamsEmotion)
    .then(analysisResults => {
        console.log(JSON.stringify(analysisResults,null,2));
        return res.send(analysisResults.result.emotion.document.emotion);
    })
    .catch(err => {
        console.log('error', err);
    });

    //return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {
    const analyzeParamsSentiment = {
        'url': req.query.url,
        'features': {
            'sentiment': {
            }
        }
    }

    getNLUInstance().analyze(analyzeParamsSEntiment)
    .then(analysisResults => {
        console.log(JSON.stringify(analysisResults,null,2));
        return res.send(analysisResults.result.sentiment.document.label);
    })
    .catch(err => {
        console.log('error', err);
    });
});

app.get("/text/emotion", (req,res) => {
    const analyzeParamsEmotion = {
        'text': req.query.text,
        'features': {
            'emotion': {
                'limit': 5
            }
        }
    }

    getNLUInstance().analyze(anlayzeParamsEmotion)
    .then(analysisResults => {
        console.log(JSON.stringify(analysisResults,null,2));
        return res.send(analysisResults.result.emotion.document.emotion);
    })
    .catch(err => {
        console.log('error', err);
    });
});

app.get("/text/sentiment", (req,res) => {
    const analyzeParamsSentiment = {
        'text': req.query.text,
        'features': {
            'sentiment': {
            }
        }
    }

    getNLUInstance().analyze(analyzeParamsSentiment)
    .then(analysisResults => {
        console.log(JSON.stringify(analysisResults,null,2));
        return res.send(analysisResults.result.sentiment.document.label);
    })
    .catch(err => {
        console.log('error', err);
    });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

