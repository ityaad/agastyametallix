# Agastya Metallix

This repository hosts a simple **single-page static website** for the custom domain `www.agastyametallix.com`.

## Configure a Custom Domain for GitHub Pages


### 1. Verify Custom Domain on GitHub (IMPORTANT)
To prevent "domain takeover" attacks, verify `www.agastyametallix.com` in **GitHub User Settings** prior to adding it to this repository settings.

For more information, see [Verifying your custom domain for GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages).


### 2. Configure the Domain on GitHub Repository
1. Go to this repository settings, then select **Pages** from the "Code and automation" sidebar.
3. Under **Custom domain**, type `www.agastyametallix.com` and click **Save**.

> **Note:** Do not delete the `CNAME` file created at the root of this repository.


### 3. Update DNS Provider Settings
Log in to domain registrar portal and add the following DNS records:

* **Apex Domain (`agastyametallix.com`):** Add four **A records** pointing to GitHub's IP addresses:
    * `185.199.108.153`
    * `185.199.109.153`
    * `185.199.110.153`
    * `185.199.111.153`
* **Subdomain (`www.example.com`):** Add a **CNAME record** pointing to default GitHub Pages URL `ityaad.github.io`.

**Note:** Do not include the repository name in the CNAME target. For example, `ityaad.github.io/agastyametallix/`.

For more information, see [Managing Custom Domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

**Summary Table of DNS Records**

| Type | Host/Name | Value/Target |
| :--- | :--- | :--- |
| **A** | `@` | `185.199.108.153` |
| **A** | `@` | `185.199.109.153` |
| **A** | `@` | `185.199.110.153` |
| **A** | `@` | `185.199.111.153` |
| **CNAME** | `www` | `username.github.io` |


### 4. Verify and Secure
1. **Wait for Propagation:** DNS changes can take up to 24 hours to take effect.
2. **Enforce HTTPS:** Once the DNS check is successful on GitHub, return to the repository settings for pages and check **Enforce HTTPS** to secure the site.


### 5. Deploy with GitHub Pages

1. In the repository settings for pages, enable **GitHub Pages**.
2. Select **Source** → **Deploy from a branch**.
3. Choose the `main` branch and set the folder to **/root**.

Once enabled, the site will be available at:

- `https://ityaad.github.io/agastyametallix/`
- `https://www.agastyametallix.com`.

> Note: GitHub Pages only supports a single custom domain per repository. To make `www.agastyametallix.in` point to the same site, configure DNS for `www.agastyametallix.in` to CNAME to `www.agastyametallix.com` or URL redirection for `agastyametallix.in` to `https://www.agastyametallix.com`.


## 6. Local preview
You can preview locally by opening `index.html` in a browser.
