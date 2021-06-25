package net.marsbytes.app.recruitment.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Application.
 */
@Entity
@Table(name = "application")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Application implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_of_application")
    private LocalDate dateOfApplication;

    @Column(name = "education")
    private String education;

    @Column(name = "experience")
    private String experience;

    @Column(name = "other_info")
    private String otherInfo;

    @Column(name = "name")
    private String name;

    @ManyToOne
    @JsonIgnoreProperties(value = { "applications" }, allowSetters = true)
    private Applicant applicant;

    @ManyToOne
    @JsonIgnoreProperties(value = { "applications", "jobCategories", "jobPosition", "clientOrganization", "process" }, allowSetters = true)
    private Jobs jobs;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Application id(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getDateOfApplication() {
        return this.dateOfApplication;
    }

    public Application dateOfApplication(LocalDate dateOfApplication) {
        this.dateOfApplication = dateOfApplication;
        return this;
    }

    public void setDateOfApplication(LocalDate dateOfApplication) {
        this.dateOfApplication = dateOfApplication;
    }

    public String getEducation() {
        return this.education;
    }

    public Application education(String education) {
        this.education = education;
        return this;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getExperience() {
        return this.experience;
    }

    public Application experience(String experience) {
        this.experience = experience;
        return this;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getOtherInfo() {
        return this.otherInfo;
    }

    public Application otherInfo(String otherInfo) {
        this.otherInfo = otherInfo;
        return this;
    }

    public void setOtherInfo(String otherInfo) {
        this.otherInfo = otherInfo;
    }

    public String getName() {
        return this.name;
    }

    public Application name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Applicant getApplicant() {
        return this.applicant;
    }

    public Application applicant(Applicant applicant) {
        this.setApplicant(applicant);
        return this;
    }

    public void setApplicant(Applicant applicant) {
        this.applicant = applicant;
    }

    public Jobs getJobs() {
        return this.jobs;
    }

    public Application jobs(Jobs jobs) {
        this.setJobs(jobs);
        return this;
    }

    public void setJobs(Jobs jobs) {
        this.jobs = jobs;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Application)) {
            return false;
        }
        return id != null && id.equals(((Application) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Application{" +
            "id=" + getId() +
            ", dateOfApplication='" + getDateOfApplication() + "'" +
            ", education='" + getEducation() + "'" +
            ", experience='" + getExperience() + "'" +
            ", otherInfo='" + getOtherInfo() + "'" +
            ", name='" + getName() + "'" +
            "}";
    }
}
