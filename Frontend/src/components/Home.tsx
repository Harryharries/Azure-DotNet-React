import React from "react";

export class Home extends React.Component<{}, {}> {
    public componentDidMount() {
        document.title = "Example - My React Application";
    }

    public render(): JSX.Element {
        return (
            <div>
                <h1>MEDFAR Developer Interview Test</h1>

                <div className="row">
                    <div className="col-lg-12">
                        <h2>Introduction  </h2>
                        <hr />
                        <p>
                            This test is meant to showcase your development skills. You will work directly in this solution and you can use any resource on the internet
                            that you think you need, (except other people).
                        </p>
                        <p>
                            We are going to assume that you are working at MEDFAR, and your new task is to deal with this "Web Application".  Let us say this was created by a very junior developer
                            during an internship. While the code our junior developer works, it does so in a less then ideal manner. You might need to modify the solutions' architecture/design/code
                            to make it better.
                        </p>
                        <p>
                            Your new boss wants you to add another feature to that splendidly designed application and also asks you to check if you could not make things better in the code ,
                        </p>
                        <p>
                            Please take note that we are judging you by the quality of the design/code/comments you leave.
                        </p>
                        <p>
                            We expect something pretty close to <strong> production quality </strong> code with all the bells and whistles that you think should belong in a production application.
                        </p>
                    </div>

                    <h2>Instructions </h2>
                    <hr />

                    <div>
                        <ul className="b">
                            <li>Buid a form (on the EXAM page) to add new items to be listed in the <a href="#example">example</a> tab table</li>
                            <li>
                                Form should validate the following:
                                <ul className="sub">
                                    <li>Unique emails</li>
                                    <li>First name and last name is required</li>
                                </ul>
                            </li>
                            <li>Format date to be displayed in example table: 2016/01/20</li>
                            <li>Add search capability in <a href="#example">example</a> tab table. A single text field would be sufficient.</li>
                            <li>Replace "Load data" button with "next / previous" paging buttons. Display 30 items at a time</li>
                            <li><a href="#example">Example</a> tab should load first 30 automatically on first load</li>
                        </ul>
                    </div>

                    <h2>What we are looking for </h2>
                    <hr />

                    <div>
                        <ul className="b">
                            <li>Clean code: use of best practices</li>
                            <li>Apply refactoring where deemed necessary</li>
                        </ul>
                    </div>

                    <h2> Other info </h2>
                    <hr />

                    <div>
                        <ul className="b">
                            <li>Don't spend too much time on UI design and CSS - as long as our eyes don't bleed, it is fine. This is not a web-designer exam. </li>
                            <li>No time to finish? Leave comments on what's left and what has to be done to complete the task. Estimate time required.</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}