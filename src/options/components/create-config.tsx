import React from "react";

function CreateConfig() {
  return (
    <div>
      <form action="">
        <div className="grid grid-rows-2 items-center justify-center">
          <div>
            <label>Config Name</label>
            <input type="text" required placeholder="Config Name" />
          </div>
          <div>
            <label>Config Name</label>
            <input type="text" required placeholder="Config Name" />
          </div>
          <div>
            <label>Model</label>
            <input
              type="text"
              placeholder="Open AI model name"
              name="model"
              required
            />
          </div>
          <div>
            <label>Temperature</label>
            <input
              type="number"
              placeholder="Temperature"
              pattern="[0-9]"
              name="temperature"
            />
          </div>
          <div>
            <label>Max Token</label>
            <input type="number" placeholder="Max Tokens" name="max_tokens" />
          </div>
          <div>
            <label>Top P</label>
            <input type="number" placeholder="Top P" name="top_p" />
          </div>
          <div>
            <label>Frequency Penalty</label>
            <input
              type="number"
              placeholder="Frequency Penalty"
              name="frequency_penalty"
            />
          </div>
          <div>
            <label>Presence Penalty</label>
            <input
              type="number"
              placeholder="Presence Penalty"
              name="presence_penalty"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateConfig;
