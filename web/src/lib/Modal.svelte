<script lang="ts">
  export let open = false;
  export let onRequestClose: () => void;
</script>

<!-- https://www.w3schools.com/howto/howto_css_modals.asp -->
<div id="myModal" class="modal" class:open>
  <div class="modal-content">
    <span class="close" on:click={onRequestClose} on:keypress={onRequestClose}
      >&times;</span
    >
    <p>Some text in the Modal..</p>
  </div>
</div>

<style>
  .modal {
    display: none;
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  }

  .open {
    display: block;
  }

  /* Modal Content/Box */
  .modal-content {
    background-color: #fefefe;
    margin: 15% auto; /* 15% from the top and centered */
    padding: 20px;
    border: 1px solid #888;
    width: 80%; /* Could be more or less, depending on screen size */
  }

  /* The Close Button */
  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
</style>
