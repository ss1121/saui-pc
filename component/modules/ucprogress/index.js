class Progress extends React.Component {
    constructor (props) {
        super(props)
    }
    render () {
        if (_.isArray(this.props.progress)) {
            return (
                <ul className="steps">
                    {
                        this.props.progress.map((item, idx) => {
                            return (
                                <li className='steps-item' key={idx}>
                                    <div className="steps-step">
                                        <span className="steps-icon icon-yuanshixin">{idx + 1}</span>
                                        <div className='steps-main'>
                                            <p >{item}</p>
                                        </div>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            )
        }else {
            console.error('Please use arrays to import components(progress)')
            return false
        }
    }
}

export default Progress