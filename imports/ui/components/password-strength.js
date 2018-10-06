import './password-strength.html'
import './password-strength.css'

function range(start, end, count) {
    let ret = []
    let step = (end - start) / (count - 1)
    for(i = start; i<=end; i += step) {
        ret.push(Math.round(i))
    }
    return ret
}

Template.passwordStrength.onRendered(function () {
    let template = this
    this.autorun(() => {
        let strength = template.data.get();
        let points = $(template.firstNode).find('.point')
        let count = points.length
        let spread = range(0,255,count)
        points.each(function(index) {
            let elem = $(this)
            if (index > strength) {
                elem.css('background-color', 'rgb(221, 221, 221)')
            } else {
                elem.css('background-color', `rgb(${spread[count-1-strength]}, ${spread[strength]}, 0)`)
            }
        })
    })
})