var article;
var iframe;
var bufferSpeed = 500;

const BLACKLIST_VALUES = [
    '0px',
    'none',
    'rgba(0, 0, 0, 0)'
]

const TITLES = [
    'special handling',
    'support notes',
    'procedure',
    'process',
    'objective',
    'cause',
    'solution',
    'symptoms',
    'additional information'
]

const WHITELIST_CSS = [
    'color',
    'background-color',
    'list-style-type',
    'text-indent',
    'margin',
    'border-left',
    'border-right',
    'border-top',
    'border-bottom',
    'font-weight',
    'list-style'
    ];

const colorMap = Object.create({
    'rgb(0, 0, 0)' : '#444443',
    'rgb(255, 0, 0)' : '#F21F22',
    'rgb(0, 127, 127)' : '#00cc66',
    'rgb(0, 128, 128)' : '#00cc66',
    'rgb(0, 140, 170)' :'#00cc66',
    'rgb(0, 0, 128)' : '#222223',
    'rgb(68, 68, 67)' : "#444443"
});

formatKb();

function cleanCSS(){
    $(article).find('*').each((index, object) =>{
        var values = new Object();
        WHITELIST_CSS.forEach(property =>{
            if (!BLACKLIST_VALUES.includes(property))
                values[property] = $(object).css(property);
        });
        $(object).removeAttr('style');
        $(object).css(values);
    });
}

// Reduces the buffer speed after the page loads;

setTimeout(() => {
    bufferSpeed = 2000;
}, 10000);


function formatKb(){
    article = location.href.includes('nav_to.do')? document.querySelector('iframe').contentDocument.querySelector('article') : $('#article');
    console.log(location.href.includes('nav_to.do'));
    cleanCSS();
    setArticleDefaultStyles();
    setLinkFormating();
    applyStyles();
    setTimeout(formatKb, bufferSpeed);
}

function setLinkFormating(linkElement = $(article).find('a')){
    $(linkElement).css({
        'color' : '#0985CE',
        'cursor' : 'pointer',
    });
    $(linkElement).find('*').each((i, o) => setLinkFormating(o))
}

function applyStyles(){
    $(article).find('*').each((i, o) => {
        var isTitle = TITLES.includes($(o).prop('textContent')?.toLowerCase())
        var currentColor = $(o).prop('style')?.color;
        var margin = $(o).prop('style')?.margin;
        var isBold = $(o).prop('tagName')?.toLowerCase() == 'strong' || ['bold', '700'].includes($(o).css('font-weight'));

        $(o).css({
            'color' : colorMap[currentColor] ?? currentColor,
            'margin' : isTitle? '5px 0' : margin,
            'text-decoration' : isTitle? '' : 'none',
            'text-shadow' : isBold || isTitle? '0 0 1px' : '',
            'font-family' : isTitle? '"Segoe UI", "Calibri"' : '',
            'font-size' : isTitle? '28px' : '22px',
            'line-height' : '32px'
        })
    });
}

function setArticleDefaultStyles(){
    $(article).css({
        'background-color' : '#FFFFFF',
        'color' : '#444443',
        'margin' : '0 auto',
        'text-align' : 'justify',
        'font-weight' : '400',
        'height' : '100%',
        'width' : '70%',
        'overflow-y' : 'auto',
        'font-size' : '22px',
        'padding': '0 20px',
        'word-wrap' : 'break-word',
        'line-height' : '32px',
        'font-feature-settings:' : '"liga", "clig", "onum"',
        'text-rendering' : 'optimizeLegibility',
        '-webkit-font-smoothing' : 'antialiased',
        'font-family' : '"Garamond", "Georgia", "Cambria", "Times New Roman"',
        'letter-spacing' : '-0.003em',
        'cursor' : 'auto',
        '-webkit-font-smoothing' : 'antialiased',
        '-webkit-font-feature-settings:' : '"liga", "clig", "onum";'
    })

    // Trim excessive linebreaks

    $(article).find('br + br').remove();
}